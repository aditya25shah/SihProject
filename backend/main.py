from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import os
from pathlib import Path
import google.generativeai as genai 

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash-lite") 

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent  # This is the backend folder
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"  # Go to SIH/frontend/dist

if not FRONTEND_DIST.exists():
    print(f"WARNING: Frontend dist folder not found at {FRONTEND_DIST}")
    print("Please run 'npm run build' in the frontend directory")

@app.post("/process")
async def process_transcript(req: Request):
    data = await req.json()
    transcript = data.get("transcript", "")
    
    if not transcript:
        return {"error": "No transcript provided"}
    
    try:
        response = model.generate_content(
            f"""Analyze the following transcript and provide a score based on:
            1. Clarity (/2)
            2. Engagement (/2)
            3. Active Listening (/2)
            4. Conciseness (/2)
            5. Empathy (/2)
            
            Give a strict evaluation with individual scores and total score out of 10.
            Provide brief feedback for each category.
            
            Transcript: {transcript}"""
        )
        result = response.text.strip()
        
        # Just return the text result directly
        return {"result": result}
            
    except Exception as e:
        return {"error": str(e)}

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    # Handle empty path (root)
    if not full_path:
        full_path = "index.html"
    
    static_file = FRONTEND_DIST / full_path
    if static_file.exists() and static_file.is_file():
        return FileResponse(static_file)
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    else:
        return {"error": "Frontend not built. Please run 'npm run build' in the frontend directory"}