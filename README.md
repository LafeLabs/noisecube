# [noisecube](https://github.com/lafelabs/noisecube/)

 - [noisecube.html](noisecube.html)
 - [noisecube.js](noisecube.js)
 - [noisecube.py](noisecube.py)
 - [noisecube.json](noisecube.json)

Noise cube is a human interface for exploring the geometry of the noise of a system.  We use [p5js](https://py5js.org) to build knobs and buttons which allow a human user to control a physics experiment with Python which then passes noise spectra back to the web front where spectra are displayed both as 1d graphs and as 2d heat maps in black and white.


## noisecube.json

```
{
    "network_analyzer":{
        "fstart":4e9,
        "fstop":9e9,
        "numpoints":101,
        "ifbw":500,
        "id":"Rohde&Schwarz,ZVA24-2Port,1145111024100131,3.30",
        "power":-30.0
    },
    "spectrum_analyzer":{
        "fstart":4e9,
        "fstop":9e9,
        "numpoints":101,
        "rbw":1e6,
        "vbw":1e3,
        "id":Hewlett-Packard, E7405A, SG45102671, A.14.04,
        "unit":"W"
    },
    "switch_network":{
        "ip_address":"169.254.10.10",
        "vna_input":true,
        "vna_ouput":true,
        "noise_diode":false
    },
    "programmable_attenuator":{
        "ip_address":"169.254.11.11",
        "value":-30
    },
    "radio_pump":{
        "frequency":6.5e9,
        "power":-26.0
    },
    "radio_probe":{
        "frequency":5.5e9,
        "power":-40.0
    },
    "qubit_flux_bias":{
        "dc_offset":0.0,
        "ac_audio_vpp":0.0,
        "ac_audio_frequency":1000
    },
    "cryogenic_noise_source":{
        "dc_offset":0.0,
        "ac_audio_vpp":0.0,
        "ac_audio_frequency":1000
    },
    "knobs":[],
    "knob_history":[],
    "noise_spectra":[],
    "vna_traces":[]
}
```


 - noisecube.json
 - noisecube.py
 - noisecube.js
 - noisecube.html
 - noisecube.css
 - dirt.js
 - dirt.py
 - dirt.html
 - noisecube-spore.py
 - noisecube-spore.json
 - p5js
 - websockets
 - numpy
 - scikit-rf

![](https://raw.githubusercontent.com/LafeLabs/noisecube.art/refs/heads/main/schematic.png)

