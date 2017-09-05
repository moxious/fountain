// import * as fs from 'fs';
const path = require('path');
import * as SequelizeStatic from 'sequelize';
const config = require('../config/config.json');
import { Sequelize } from 'sequelize';

export interface SequelizeModels {
    Product: SequelizeStatic.Model<any, any>;
}

const env = process.env.NODE_ENV || 'development';

export class Database {
    private _basename: string;
    private _models: SequelizeModels;
    private _sequelize: Sequelize;

    constructor() {
        this._basename = path.basename(module.filename);

        this._sequelize = new SequelizeStatic(config[env].database, config[env].username, config[env].password, config[env]);
        this._models = ({} as any);

        /*
         * LOAD MODELS
        fs.readdirSync(__dirname).filter((file: string) => {
            return (file !== this._basename) && (file !== 'interfaces');
        }).forEach((file: string) => {
            console.log('import ', path.join(__dirname, file));
            let model = require(path.join(__dirname, file));
            this._models[(model as any).name] = model;
        });

        Object.keys(this._models).forEach((modelName: string) => {
            if (typeof this._models[modelName].associate === 'function') {
                this._models[modelName].associate(this._models);
            }
        });
        */
    }

    getModels() {
        return this._models;
    }

    getSequelize() {
        return this._sequelize;
    }
}

const database = new Database();
export const models = database.getModels();
export const sequelize = database.getSequelize();

export default database;

