from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

import google.generativeai as genai 

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

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

@app.post("/process")
async def process_transcript(req: Request):
    data = await req.json()
    transcript = data.get("transcript", "")
    
    try:
        response = model.generate_content(
            f"""Analyze the Following Transcript and Provide a Score based on 
            1. Clarity
            2. Engagement
            3. Active Listening
            4. Conciseness
            5. Empathy 
            Give the Score Out of 10 which 2 marks for each point. Do a Strict Evaluation.
            : {transcript}"""
        )
        result = response.text.strip()
        return{"result" : result}
    except Exception as e:
        return {"error": str(e)}