# Wiz Smart Light Art-Net Node
Node app that allows controlling Wiz smart lights through Art Net/DMX. This app converts DMX data sent over UDP using the Art Net protocol to JSON messages, thus allowing the bulb to behave as an Art Net node. 

## Requirements
* Node

## Installation and Running
1. Edit the IP addresses at the top of `index.js.`
2. Run following commands:
    ```
    npm install
    npm start
    ```
3. Select this PC as the output node in a Art Net controller. I used [QLC+](https://www.qlcplus.org/) as a virtual controller.
