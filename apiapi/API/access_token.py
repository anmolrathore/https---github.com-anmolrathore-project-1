

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from model_db import users_db
from fastapi import status, Depends, HTTPException
from security import oauth2_scheme, TokenData, get_user, User


SECRET_KEY = "sahilsdlasdsadfasfas"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = .00069 * 30    # 30 minutes



def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=0)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt




async def get_current_user(token: str = Depends(oauth2_scheme)):
    print(token)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("payload : ",payload)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
        print("token_data : ",token_data)
    except JWTError:
        raise credentials_exception
    user = get_user(users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user



async def get_current_active_user(current_user: User = Depends(get_current_user)):
    print(current_user)
    return current_user
