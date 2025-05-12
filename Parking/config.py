import os

class Config:
    SECRET_KEY = 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = 'mysql://root:@localhost/parking_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
