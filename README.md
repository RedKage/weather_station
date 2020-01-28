# weather_station

> A minimalist weather station made for my own needs.  
> I pretty much wanted to show an air quality index and some weather info.  
> It's pulling the air quality and the weather conditions from [BreezoMeter](https://breezometer.com/).  

# How do use this?

- Download the [latest release](https://github.com/RedKage/weather_station/releases/latest/download/dist.zip).
- Unzip somewhere in a folder of your choice.
- Open `index.html`.
- Done

Additionally, open `config.js` in your favorite editor an change stuff according to the [Configuring section](#configuring) below.

# How do I build this?

``` bash
# clone this repo
$ git clone https://github.com/RedKage/weather_station.git
$ cd weather_station

# install dependencies
$ npm run install

# generate static project
$ npm run generate
```

The result of this will be in the created `dist` folder at the root of the project.  
Now you can open the `index.html`.  
Enjoy.

# Configuring

In the `dist` folder there is a `config.js` file (and a backup `config.default.js`).

The `config.js` holds at the top level:
- The [BreezoMeter](https://breezometer.com/) API key
- An array of locations
- An object holding the weather icons for each weather state

This means you can configure multiple locations for your weather station.

One location is an object with:
- A name
- A [Material Design icon](https://materialdesignicons.com)
- Coordinates in object with two props lon and lat. Use [this](https://www.mapcoordinates.net/en) to find them.
- A background images array, which will be displayed as the background of the station. Images will cycle every 30 minutes for now. Built in, some from [Unspalsh](https://unsplash.com/).

# Technical specs

This project uses [VueJS](https://vuejs.org/) through [Nuxt](https://nuxtjs.org). It's made so that you _do not_ need any webserver: everything can run locally from a browser, preferrably Chromium.

This way, you can host this anywhere, be it on an actual web server like nginx, or not.  
For instance you can just throw the `dist` folder on a Raspberry Pi and open the `index.html` file.  

# Running on a Rapsberry Pi

The following is my own version of this [guy's tutorial](https://pimylifeup.com/raspberry-pi-kiosk/).

## Hardware you need

- Raspberry Pi (I own a Pi Zero without wifi)
- micro-USB USB hub
- 7" [Screen](https://www.aliexpress.com/item/7-inch-1024x600-USB-HDMI-LCD-Display-Monitor-Capacitive-Touch-Screen-Case-For-Raspberry-Pi-4/4000080314269.html?spm=a2g0s.9042311.0.0.39b84c4dDWZULg)
- Some [fancy USB cables](https://www.aliexpress.com/item/FFC-USB-3-1-Type-c-cable-FPV-Flat-Slim-Thin-Ribbon-FPC-Cable-Micro-USB/32863661221.html?spm=a2g0s.9042311.0.0.1a194c4djq4MjG)
- One [fancy HDMI cable](https://www.aliexpress.com/item/FPV-Micro-HDMI-Mini-HDMI-90-degree-Adapter-5cm-100cm-FPC-Ribbon-Flat-HDMI-Cable-Pitch/32914942505.html?spm=a2g0s.9042311.0.0.1a194c4djq4MjG)
- A [fancier box](https://www.aliexpress.com/item/Raspberry-Pi-Zero-W-Acrylic-Case-Aluminum-Heat-Sink-for-RPI-Zero-Box-Cover-Shell-Enclosure/32951041395.html?spm=a2g0s.9042311.0.0.1a194c4djq4MjG) for your Pi Zero

Put all of this together.  
Install [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) or [NOOBS](https://www.raspberrypi.org/downloads/noobs/). Doesn't matter.

## Make it a kiosk

Create a little bash script containing the following:

``` bash
#!/bin/bash
xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &

chromium-browser --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI ~/dist/index.html
```

Test this out with:
```
./kiosk.sh
```

Give it a minute to start, it's a $5 Pi Zero with little power.
This should open Chromium with the project's page.
Once this is open, tap/click on the `[ ]` icon to make it full screen.

It's not fullscreen by default, it's my choice.  
But you could do it with an extra Chromium parameter.
I just prefer to manually fullscreen it, so in case I need to use the Pi for something else, then it's easy to exit the page without any physical keyboard attached.

Yes the console stays open when you run `./kiosk.sh`, that's normal. It's usefull for the next step below.

## Run the kiosk on boot

Go and create a new systemd service:

```
sudo nano /lib/systemd/system/kiosk.service
```

And put the following inside

```
[Unit]
Description=Chromium Kiosk
Wants=graphical.target
After=graphical.target

[Service]
Environment=DISPLAY=:0.0
Environment=XAUTHORITY=/home/pi/.Xauthority
Type=simple
ExecStart=/bin/bash /home/pi/kiosk.sh
Restart=on-abort
User=pi
Group=pi

[Install]
WantedBy=graphical.target
```

Now enable the service

```
sudo systemctl enable kiosk.service
```

Try and reboot your Pi to see if this works.  
As always, _give it some time_, that little guy is weak, Chromium is big, the project uses a lot of Javascript. Lag is gonna happen.

# Dude, you just LEAKED you API key to the world, it's INSIDE the config file!

Yeah, I just did. But no, that's not mine.  
It's the API key that their public [mobile app](https://play.google.com/store/apps/details?id=app.breezometer) is using... eheh.

I put this section at the end of this readme so as not to distract your feeble mind.

---

## License ##
|![http://i.imgur.com/oGGeSQP.png](http://i.imgur.com/oGGeSQP.png)|The license for "weather_station" is the [WTFPL](http://www.wtfpl.net/): _Do What the Fuck You Want to Public License_.|
|:----------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
