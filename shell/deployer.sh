#!/bin/bash
# shellcheck disable=SC2086
# shellcheck disable=SC2164
# shellcheck disable=SC2006
# shellcheck disable=SC2046
# shellcheck disable=SC2129
# shellcheck disable=SC2261
clear;
echo "Welcome to void-deployer!"
sleep 1
echo "  This is a shell script that automates the configuration of a window manager on Void Linux to some extent."
echo "  Also performs some preconfiguration and installs extra utilities to save time and hassle later."
sleep 1
echo " "
echo "Important: 1. Please read the EULA before continuing."
echo "           2. The creator of this script was a little lazy and didn't add many failsafes,"
echo "              Please feed your input EXACTLY as specified, else major problems may occur."
echo "           3. If you're not sure about something, Do NOT begin the installation."
echo "           4. This script MUST be run as ROOT."
echo "           5. This is very obvious, but this script MUST be run on a fresh Void Linux installation,"
echo "              Preferably nothing apart from basic configuration and no user."
echo " "
echo "Consciousness Check:"
echo "              This is a measure kept to prevent automatic execution of this script."
echo "              If you wish to proceed, Please enter 8881729 in the next prompt."
read -r -p '> ' conscchk
if [ $conscchk = 8881729 ];
then
    echo "Consciousness Check successful!"
    echo " "
    sleep 1
    if [[ $(id -u) == 0 ]];
    then
        echo "Beginning system update. This might take a while.."
        xbps-install -Syu
        echo " "
        echo "Installing some software and utilities. Modify in the script if needed.."
        echo " "
        xbps-install git wget curl xorg-base base-devel xorg libXft-devel libX11-devel libXinerama-devel firefox nitrogen terminus-font picom sct
        echo "Would you like to create a new user? You can skip this if you have already configured one."
        echo "Note: This user will have superuser access. To disable this, modify the script manually, or change it later in visudo."
        read -r -p 'Enter Y/N: ' userconfirm
		# shellcheck disable=SC1009
        if [[ $userconfirm = y ]] || [[ $userconfirm = Y ]];
        then
            echo "Creating a new user.."
            read -r -p "Enter a username: " username
            useradd -mG wheel $username
            passwd $username
            echo " "
            echo "User creation complete."
            echo "Granting $username superuser access.."
            echo "$username  ALL(ALL:ALL) ALL" > /etc/sudoers
            echo "Done."
        elif [[ $userconfirm = n ]] || [[ $userconfirm = N ]]; then
            echo "Not creating a new user."
            read -r -p "Please enter the existing user's username: " username
        fi
        echo "Creating basic directories in user's home folder.."
        echo "(Will skip if they already exist)"
        cd /home/$username
        mkdir Documents
        mkdir Downloads
        mkdir Pictures
        mkdir Videos
        mkdir Source
        cd Source
        echo " "
        echo "Cloning git repositories of wallpapers, dwm, dmenu and st..."
        git clone https://codeberg.org/cyberjudas/dwm
        git clone https://codeberg.org/cyberjudas/st
        git clone https://git.suckless.org/dmenu
        git clone https://codeberg.org/cyberjudas/wallpapers
        echo " "
        echo "Compiling dwm, dmenu and st..."
        cd dwm
        make
        make install
        cd ../st
        make
        make clean install
        cd ../dmenu
        make
        make install
        echo "Done."
        echo " "
        echo "Setting wallpaper.."
        cd wallpapers
        nitrogen --set-centered 2.jpg
        echo "Done."
        sleep 1
        echo "Creating custom .bashrc and .xinitrc.."
        cd /home/$username
        touch .bashrc
        touch .xinitrc
        echo "nitrogen --restore &" >> .xinitrc
        echo "picom -f &" >> .xinitrc
        read -r -p "Is this a Laptop or a Desktop/VM? (Type L/D): " bat
        if [[ $bat = l ]] || [[ $bat = L ]];
        then
            echo "Adding a battery monitor to statusbar.."
            echo "while xsetroot -name " TIME: `date +%H:%M` | DATE: `date +"%A, %d %B %Y"` | BATTERY: `cat /sys/class/power_supply/BAT1/capacity`% | STATUS: [`cat /sys/class/power_supply/BAT1/status`]"" >> .xinitrc
        elif [[ $bat = d ]] || [[ $bat = D ]];
        then
            echo "Not adding a battery monitor to statusbar.."
            echo "while xsetroot -name " TIME: `date +%H:%M` | DATE: `date +"%A, %d %B %Y"`"" >> .xinitrc
        fi
        echo "do" >> .xinitrc
        echo "sleep 2" >> .xinitrc
        echo "done &" >> .xinitrc
        echo "sct 3600" >> .xinitrc
        echo "exec dwm" >> .xinitrc
        echo "alias 'xi'=xbps-install " >> .bashrc
        echo "alias 'xu'=xbps-install -Syu" >> .bashrc
        echo "alias 'xr'=xbps-remove " >> .bashrc
        echo "export PS1="[\W] >  "" >> .bashrc
        echo "Done.."
        echo " "
        echo "Please reboot and run 'startx'. If no issues have occurred, your Void Linux installation is ready for use."
    else
        echo "Missing Privileges. Please run this script as root."
    fi
else
    echo "Consciousness Check failed. Exiting program..."
fi
