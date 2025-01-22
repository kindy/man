# man (manual)

read man pages in browser, localy

> it's still in prototype

## setup

### macOS

* install [brew](https://brew.sh)
* `brew install groff`
* install [bun](https://bun.sh)

## run

* clone this repo and cd into it
  * no need to do any install, bun is enough
* `bun run mandoc.ts`

> this will create directory `html` in cwd (details in mandoc.ts).
> you can delete it when the server stopped, or just leave it

* access it
  * http://localhost:3000/man
  * http://localhost:3000/man.7

---

## man online

* https://linux.die.net/man/1/man
* https://man7.org/linux/man-pages/man1/man.1.html

## man tools

* [groff](https://www.gnu.org/s/groff)
* [n-t-roff/heirloom-doctools](https://github.com/n-t-roff/heirloom-doctools)
