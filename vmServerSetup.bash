python3 -m venv venv
source venv/bin/activate
export FLASK_APP=server.py
export FLASK_ENV=development
flask run --host=0.0.0.0 > log.txt 2>&1  &

cd game-score
export HOST=0.0.0.0
nohup npm start &
