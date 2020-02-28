const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let dailyRecordSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de Asistencia es requerida']
    },
    enterHour: {
        type: Date,
        required: false
    },
    exitHour: {
        type: Date,
        required: false
    },
    exit: {
        type: Boolean,
        default: false
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'El paciente es requerido']
    },
    vitalSigns: [{
        vitalSign: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: [true, 'La fecha de lectura es requerida']
        },
        value: {
            type: Number,
            required: true
        },
        valueB: {
            type: Number,
            required: false
        }
    }],
    technicalSupport: [{
        type: String,
        required: false
    }],
    behavior: [{
        name: {
            type: String,
            required: false
        },
        time: {
            type: String,
            required: false
        },
        score: {
            type: Number,
            required: false
        }
    }],
    hygiene: [{
        name: {
            type: String,
            required: false
        },
        time: {
            type: String,
            required: false
        },
        observation: {
            type: String,
            required: false
        }
    }],
    meal: {
        quantity: {
            type: Number,
            required: false
        },
        foodType: {
            type: String,
            required: false
        },
        independence: {
            type: Number,
            required: false
        },
        functional: {
            type: Number,
            required: false
        },
        chewingPerformance: {
            type: Number,
            required: false
        }
    },
    phaseBinnacle: {
        orientation: {
            type: Boolean,
            required: false
        },
        date: {
            type: Boolean,
            required: false
        },
        observation: {
            type: String,
            required: false
        },
        activities: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            },
            performance: {
                type: Number,
                required: false
            }
        }],
        status: {
            type: Boolean,
            default: false
        }
    },
    physioBinnacle: {
        startMood: {
            type: Number,
            required: false
        },
        endMood: {
            type: Number,
            required: false
        },
        startTime: {
            type: Date,
            required: false
        },
        endTime: {
            type: Date,
            required: false
        },
        activities: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            },
            performance: {
                type: Number,
                required: false
            }
        }],
        status: {
            type: Boolean,
            default: false
        }
    },
    physicalActivation: {
        type: Number,
        required: false
    },
    collation: {
        type: Number,
        required: false
    }
});


module.exports = mongoose.model('DailyRecord', dailyRecordSchema);