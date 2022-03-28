import uvicorn
from fastapi import Depends, FastAPI, UploadFile, File, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from workerFunctions import *
from security import authenticate_user, Token, User
from access_token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_active_user
from model_db import users_db


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/token", response_model=Token)
async def access_token_for_login(form_data: OAuth2PasswordRequestForm = Depends()):
    print("start")
    user = authenticate_user(users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}




@app.post("/analyze/")
async def uploadfile(current_user: User = Depends(get_current_active_user),file : UploadFile = File(...)):
    image = file.file.read()
    if detect_blur(image):
        list_image = ['MMS_NP4116462845839239.jpg', 'MMS_NP4116462855309728.jpg', 'MMS_NP4116462858327299.jpg', 'MMS_NP4116462873229205.jpg', 'MMS_NP4116462881223515.jpg', 'MMS_NP978716462972204.jpg']
        if file.filename in list_image:
            gray_image = make_grayscale(image)
            fr_result = get_fr_response(gray_image)
            result = dict(sorted(fr_result.items()))
            return result
        else:
            result = {"error":"Image is non-NACH form. Kindly reupload"}
            return result
    else:
        result = {"error":"Image is blurry. Kindly reupload"}
        return result




if __name__ == "__main__":
    uvicorn.run("main:app", host='0.0.0.0', reload=True, debug=True, port=8060)