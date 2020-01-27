# weather_station

> A minimalist weather station made for my own needs.
> I pretty much wanted to show an air quality index and some weather info.
> It's pulling the air quality and the weather conditions from [BreezoMeter](https://breezometer.com/).

## How do I build this?

``` bash
# clone this repo
$ git clone https://github.com/RedKage/weather_station.git

# install dependencies
$ npm run install

# generate static project
$ npm run generate
```

## How do I use this?

Once you have generated the project with `npm run generate` head to the `dist` folder.
Now make a copy of the default config file `config.default.js` to `config.js`.
Now you can open the `index.html`.
Enjoy.

## Configuring

The `config.js` holds at the top level:
- The BreezoMeter API key
- An array of Locations
- An object holding the weather icons

So in effect you can configure multiple Locations for your weather station.

One loation is an object with:
- Some fancy stuff like a name
- A (Material Design icon)[https://materialdesignicons.com/]
- Coordinates in object with two props lon and lat
- A background images array, which will be displayed as the background of the station. Images will cycle every 30 minutes for now

## Dude, you just LEAKED you API key to the world, it's INSIDE the config file!

Yeah, I just did. But no, that's not mine.
It's the API key that their [mobile app](https://play.google.com/store/apps/details?id=app.breezometer) is using... eheh.

## Technical specs

This project uses VueJS through Nuxt. It's made so that you _do not_ need any webserver: everything can run locally from a browser, preferrably Chromium.

This way, you can host this anywhere, be it on an actual web server like nginx, or not. For instance you can just throw the dist folder to a Raspberry Pi and open the index.html.
Done.

# Running on a Rapsberry Pi

You gonna need:
- Raspberry Pi (I own a Pi Zero without wifi)
- micro-USB USB hub
- [Screen](https://www.aliexpress.com/item/7-inch-1024x600-USB-HDMI-LCD-Display-Monitor-Capacitive-Touch-Screen-Case-For-Raspberry-Pi-4/4000080314269.html?spm=a2g0s.9042311.0.0.39b84c4dDWZULg)
- Some [fancy USB cables](https://www.aliexpress.com/item/FFC-USB-3-1-Type-c-cable-FPV-Flat-Slim-Thin-Ribbon-FPC-Cable-Micro-USB/32863661221.html?spm=a2g0s.9042311.0.0.1a194c4djq4MjG)
- One [fancy HDMI cable](https://www.aliexpress.com/item/FPV-Micro-HDMI-Mini-HDMI-90-degree-Adapter-5cm-100cm-FPC-Ribbon-Flat-HDMI-Cable-Pitch/32914942505.html?spm=a2g0s.9042311.0.0.1a194c4djq4MjG)
- A [fancier box](https://www.aliexpress.com/item/Raspberry-Pi-Zero-W-Acrylic-Case-Aluminum-Heat-Sink-for-RPI-Zero-Box-Cover-Shell-Enclosure/32951041395.html?spm=a2g0s.9042311.0.0.1a194c4djq4MjG) for your Pi Zero

Assemble, and then run

``` bash
#!/bin/bash
xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &

chromium-browser --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI ~/dist/index.html
```

Next step is to run this script when your Pi boots.

---

## License ##
|![http://i.imgur.com/oGGeSQP.png](http://i.imgur.com/oGGeSQP.png)|The license for "weather_station" is the [WTFPL](http://www.wtfpl.net/): _Do What the Fuck You Want to Public License_.|
|:----------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
