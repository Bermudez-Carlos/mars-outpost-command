# mars-outpost-command

## Run the game

The public game is a static HTML/CSS/JavaScript app. Open `index.html` or host the folder with any static web server. NASA live telemetry uses the local `/nasa-donki` proxy when available; if the proxy is unavailable, the game falls back to simulated hazard data.

`server.py` is intentionally ignored and is not included in a public push. Keep private credentials in the ignored `.env` file, never in front-end files.