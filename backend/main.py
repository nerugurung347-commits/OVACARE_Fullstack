import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client
from database import init_database

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

app = FastAPI(title="Ovacare API", version="1.0.0")

# =============================================
# CORS MIDDLEWARE
# =============================================
# Add your Vercel production URL below
# e.g. "https://your-app.vercel.app"
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
    "https://ovacare-fullstack.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================
# STARTUP EVENT
# =============================================
@app.on_event("startup")
async def startup_event():
    init_database()


# =============================================
# PYDANTIC MODELS
# =============================================
class SignUpRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileData(BaseModel):
    full_name: Optional[str] = None
    age: Optional[str] = None
    city: Optional[str] = None


class CycleData(BaseModel):
    last_period_date: Optional[str] = None
    cycle_length: Optional[str] = None
    current_phase: Optional[str] = None


class PreferencesData(BaseModel):
    cuisine: Optional[str] = None
    health_goal: Optional[str] = None
    movement_type: Optional[str] = None


class SaveProfileRequest(BaseModel):
    profile: Optional[ProfileData] = None
    cycle_data: Optional[CycleData] = None
    preferences: Optional[PreferencesData] = None


# =============================================
# HELPER: GET USER FROM TOKEN
# =============================================
async def get_current_user(authorization: str = Header(...)):
    """Extract and verify user from the Authorization header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user_response.user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# =============================================
# ENDPOINTS
# =============================================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/auth/signup")
async def signup(request: SignUpRequest):
    """Sign up a new user with Supabase Auth."""
    try:
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "full_name": request.full_name or "",
                }
            }
        })

        if response.user is None:
            raise HTTPException(status_code=400, detail="Sign up failed")

        return {
            "message": "Sign up successful. Please check your email for verification.",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower():
            raise HTTPException(status_code=400, detail="User already registered")
        raise HTTPException(status_code=500, detail=f"Sign up failed: {error_msg}")


@app.post("/auth/login")
async def login(request: LoginRequest):
    """Log in a user with Supabase Auth."""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })

        if response.session is None:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        return {
            "message": "Login successful",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email,
            }
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@app.post("/profile/save")
async def save_profile(request: SaveProfileRequest, user=Depends(get_current_user)):
    """Save or update profile, cycle data, and preferences for the authenticated user."""
    user_id = user.id
    results = {}

    try:
        # Save profile data
        if request.profile:
            profile_dict = request.profile.model_dump(exclude_none=True)
            if profile_dict:
                profile_dict["user_id"] = user_id
                supabase.table("profiles").upsert(
                    profile_dict,
                    on_conflict="user_id"
                ).execute()
                results["profile"] = "saved"

        # Save cycle data
        if request.cycle_data:
            cycle_dict = request.cycle_data.model_dump(exclude_none=True)
            if cycle_dict:
                cycle_dict["user_id"] = user_id
                supabase.table("cycle_data").upsert(
                    cycle_dict,
                    on_conflict="user_id"
                ).execute()
                results["cycle_data"] = "saved"

        # Save preferences
        if request.preferences:
            prefs_dict = request.preferences.model_dump(exclude_none=True)
            if prefs_dict:
                prefs_dict["user_id"] = user_id
                supabase.table("preferences").upsert(
                    prefs_dict,
                    on_conflict="user_id"
                ).execute()
                results["preferences"] = "saved"

        return {"message": "Profile saved successfully", "results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save profile: {str(e)}")


@app.get("/profile/get")
async def get_profile(user=Depends(get_current_user)):
    """Get profile, cycle data, and preferences for the authenticated user."""
    user_id = user.id
    result = {}

    try:
        # Get profile
        profile_response = supabase.table("profiles").select("*").eq("user_id", user_id).execute()
        result["profile"] = profile_response.data[0] if profile_response.data else None

        # Get cycle data
        cycle_response = supabase.table("cycle_data").select("*").eq("user_id", user_id).execute()
        result["cycle_data"] = cycle_response.data[0] if cycle_response.data else None

        # Get preferences
        prefs_response = supabase.table("preferences").select("*").eq("user_id", user_id).execute()
        result["preferences"] = prefs_response.data[0] if prefs_response.data else None

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")