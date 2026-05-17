import sqlite3
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import ollama
import sqlglot
import sqlglot.expressions as exp
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Requirement directory for static HTML serving
req_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Requirement"))
if os.path.exists(req_path):
    app.mount("/Requirement", StaticFiles(directory=req_path), name="Requirement")

DB_PATH = "mfg_ops.db"

class ChatRequest(BaseModel):
    message: str

def get_db_schema() -> str:
    """Extracts the schema from the SQLite database to provide to the LLM."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        schema = "\n".join([table[0] for table in tables if table[0]])
        conn.close()
        return schema
    except Exception as e:
        return f"Error extracting schema: {e}"

def safe_parse_and_limit_sql(raw_sql: str) -> str:
    """
    Parses the SQL, ensures it is a SELECT statement, and enforces a LIMIT 200.
    Raises ValueError if it's not a safe SELECT statement.
    """
    try:
        # Remove <text> tags if the LLM hallucinated them around the SQL
        raw_sql = re.sub(r"</?text>", "", raw_sql, flags=re.IGNORECASE).strip()

        # Extract SQL from markdown if present
        match = re.search(r"```sql\s*(.*?)\s*```", raw_sql, re.DOTALL | re.IGNORECASE)
        if match:
            raw_sql = match.group(1)
            
        parsed = sqlglot.parse_one(raw_sql, read="sqlite")
        
        # Check if the parsed query is a SELECT statement
        if not isinstance(parsed, exp.Select):
            raise ValueError("Only SELECT queries are allowed.")
            
        # Ensure no destructive operations are hidden inside CTEs or subqueries (mostly SQLite doesn't support them in SELECT, but just in case)
        for node in parsed.walk():
            if isinstance(node[0], (exp.Insert, exp.Update, exp.Delete, exp.Drop, exp.Alter, exp.Create, exp.Command)):
                raise ValueError("Unauthorized operation detected in the query.")

        # Enforce LIMIT 200
        limit_val = 200
        if parsed.args.get("limit"):
            try:
                existing_limit = int(parsed.args["limit"].expression.this)
                limit_val = min(existing_limit, 200)
            except:
                pass
        
        parsed = parsed.limit(limit_val)
        return parsed.sql(dialect="sqlite")
        
    except sqlglot.errors.ParseError as e:
        raise ValueError(f"Failed to parse SQL query: {e}")

@app.post("/chat")
async def chat(request: ChatRequest):
    schema = get_db_schema()
    
    system_prompt = f"""You are a SQLite database assistant. 

If the user asks a question about data, your task is to output ONLY a valid SQLite query to answer the user's question. Do not include any explanations. Just the raw SQL or SQL inside a markdown block.

If the user is just greeting you (e.g. "hi", "hello") or asking about your capabilities (e.g. "what can you do?"), you MUST wrap your response in <text> tags. For example:
<text>Hello! I am an AI assistant that can query the manufacturing database. I can look up machines, work orders, and alarms for you.</text>

If the user ask about who created you, you MUST wrap your response in <text> tags. For example:
<text>I was created by Ismail Faruqi Faisol.</text>

IMPORTANT: If the user asks for a chart, graph, or distribution, you MUST structure your query to return exactly two columns:
1. The first column should be the label/category (e.g., string or date).
2. The second column should be the numerical value to be plotted.
Group and aggregate the data appropriately.

Here is the database schema:
{schema}
"""

    try:
        response = ollama.chat(
            model='llama3.2:3b',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': request.message}
            ]
        )
        
        llm_output = response['message']['content']
        
        # Safely parse and enforce constraints FIRST, so we don't accidentally skip valid SQL queries
        try:
            safe_sql = safe_parse_and_limit_sql(llm_output)
        except ValueError as ve:
            # If no valid SQL is found, check if it's a conversational response
            text_match = re.search(r"<text>(.*?)</text>", llm_output, re.DOTALL | re.IGNORECASE)
            if text_match:
                return {"ok": True, "conversational": True, "text": text_match.group(1).strip()}
                
            return {"ok": False, "error": str(ve), "raw_llm_output": llm_output}
        
        # Execute query
        conn = sqlite3.connect(DB_PATH)
        # return rows as dicts
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute(safe_sql)
        rows = cursor.fetchall()
        
        if rows:
            columns = list(rows[0].keys())
        else:
            # Try to get column names from description
            columns = [description[0] for description in cursor.description] if cursor.description else []
            
        # Convert sqlite3.Row to dict
        rows_dicts = [dict(row) for row in rows]
        
        conn.close()
        
        return {
            "ok": True,
            "columns": columns,
            "rows": rows_dicts,
            "row_count": len(rows_dicts),
            "sql_executed": safe_sql
        }
        
    except Exception as e:
        return {"ok": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
