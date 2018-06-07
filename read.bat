@echo off
for %%f in (*.json) do (
"mongoimport.exe" --jsonArray --db wikiarticles --collection revisions --file "%%f"
)