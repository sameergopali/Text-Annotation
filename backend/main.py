
from app import App
from config import Config

if __name__ == "__main__":
    config =  Config()
    app = App(config)
    app.run()   