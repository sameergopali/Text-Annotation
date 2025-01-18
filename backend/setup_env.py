import os
import subprocess
import sys

def install_virtualenv():
    """Check if virtualenv is installed and install it if not."""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "show", "virtualenv"])
        print("virtualenv is already installed.")
    except subprocess.CalledProcessError:
        print("virtualenv not found. Installing virtualenv...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "virtualenv"])

def create_virtual_environment(env_name="venv"):
    """Create a virtual environment using virtualenv."""
    if not os.path.exists(env_name):
        print(f"Creating virtual environment: {env_name}...")
        subprocess.check_call([sys.executable, "-m", "virtualenv", env_name])
    else:
        print(f"Virtual environment '{env_name}' already exists.")

def activate_virtual_environment(env_name="venv"):
    """Activate the virtual environment based on the OS platform."""
    if os.name == "nt":
        activate_script = os.path.join(env_name, "Scripts", "activate.bat")
        subprocess.call(activate_script, shell=True)
    else:
        activate_script = os.path.join(env_name, "bin", "activate")
        subprocess.call(f"source {activate_script}", shell=True)
    print(f"Activated virtual environment: {env_name}")

def install_dependencies(requirements_file="requirements.txt"):
    """Install dependencies from requirements.txt."""
    if os.path.exists(requirements_file):
        print("Installing dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_file])
    else:
        print(f"No '{requirements_file}' file found. Skipping dependency installation.")

def setup_environment():
    """Main function to automate environment setup."""
    env_name = "venv"
    install_virtualenv()
    create_virtual_environment(env_name)
    activate_virtual_environment(env_name)
    install_dependencies()

if __name__ == "__main__":
    setup_environment()
