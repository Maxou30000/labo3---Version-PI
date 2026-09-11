// CE FICHIER EST MAJORITAIREMENT GÉNÉRÉ PAR COPILOT INTÉGRÉ.
var outputs = {};
var pinByModule = {
    1: 5,
    2: 6,
    3: 13,
    4: 19,
    5: 26,
    6: 21
};

var enabled = process.env.GPIO_ENABLED !== 'false' && process.platform === 'linux';

if (enabled) {
    try {
        var Gpio = require('onoff').Gpio;

        Object.keys(pinByModule).forEach(function (numero) {
            outputs[numero] = new Gpio(pinByModule[numero], 'out');
            outputs[numero].writeSync(0);
        });

        console.log('GPIO: pilote onoff');
    } catch (error) {
        enabled = false;
        console.warn('GPIO indisponible: ' + error.message);
    }
}

function setModuleState(numero, etat) {
    if (!enabled || !outputs[numero]) {
        return;
    }

    outputs[numero].writeSync(etat ? 1 : 0);
}

function reset() {
    Object.keys(pinByModule).forEach(function (numero) {
        setModuleState(numero, 0);
    });
}

function close() {
    Object.keys(outputs).forEach(function (numero) {
        outputs[numero].unexport();
    });
    outputs = {};
}

module.exports = {
    pinByModule: pinByModule,
    setModuleState: setModuleState,
    reset: reset,
    close: close
};

// CE FICHIER EST MAJORITAIREMENT GÉNÉRÉ PAR COPILOT INTÉGRÉ.