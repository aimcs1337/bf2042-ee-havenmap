# BF2042 EE Haven Map
This repository provides a simple online Leaflet map for Battlefield 2042, specificially "Haven".
It is only intended and configured for the use of research on the latest known clues of the Phantom Program Easter Egg.

For news, help, troubleshooting and contribution, please refer to the official Battlefield Easter Egg Community Discord ([discord.gg/bfee](https://discord.gg/bfee)).
> Disclaimer: This repository is intended for research and educational purposes only. It is not affiliated with, endorsed by, or supported by EA or DICE. Use of this content must comply with Battlefield's terms of service and community guidelines.

## 📦 Installation
1. Clone this repository into a desired folder
```
git clone https://github.com/aimcs1337/bf2042-ee-havenmap.git
```
2. Open the folder, where you have cloned the repository
3. Open (double-click) `index.html` and the Map will open in your default browser

## ⁉️ FAQ
* **Where is my map data stored?**
  * Map data is stored locally in your browser using localStorage and never connected or distributed to any servers.
    
* **Can I share my map data?**
  * Yes! You are free to export and share this data if you wish. However, please note that I do not provide a tutorial for exporting or importing marker data, and I am not responsible for any sensitive or personal information you choose to share.
    
* **I don't want the map anymore, how can I delete it?**
  * Simply delete the repository folder

* **I want to delete my map data from my browser**
  * If you'd like to delete this data (without affecting anything else stored in your browser), you can do so manually.
  * **If you're unsure about using browser developer tools, feel free to ask someone you trust to help — like a friend, a colleague, or anyone familiar with web browsers.**
    
    1. Press `F12` or right-click anywhere and choose Inspect to open Developer Tools.
    2. Go to the **Console** tab
    3. Type the following command and press Enter:
       ```
       localStorage.removeItem('customMarkers');
       ```
    4. This will remove all saved marker data for the map.
      
       > **⚠️ Note: This action cannot be undone. Make sure to export any data you want to keep first.**
  
