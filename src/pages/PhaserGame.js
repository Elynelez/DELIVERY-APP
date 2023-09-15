import React, { useEffect } from 'react';
import Phaser from 'phaser';

export const PhaserGame = () => {
    useEffect(() => {
        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: {
                preload: preload,
                create: create, 
            }
        }
        
        const game = new Phaser.Game(config)

        function preload() {
            this.load.image('bomb', '../assets/bomb.png')
        }

        function create() {
        }
    }, []);

    return <div id="canvas-phaser"></div>;
};