#production document
https://docs.google.com/spreadsheets/d/1tdiAFDizByTGhPSMamC3QLcofTrlX3HpFzXetxAiNiY/edit?ts=5a2f801d#gid=1016795302


# mobi-admin

## Install

  yarn install || npm install

  git submodule init

  git submodule update

## Running

  yarn build:staging

  yarn build:production

## nginx 

```bash
server
    {
		location / {
				index  index.html;
				try_files $uri $uri/ /index.html;
		}
	}
```
