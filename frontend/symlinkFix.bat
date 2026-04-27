FOR /F "tokens=*" %%a in ('node -e "console.log(require('fs').realpathSync(process.cwd()))"') do (
	SET "OUTPUT=%%a"
)
cd %OUTPUT%
npm run dev-local