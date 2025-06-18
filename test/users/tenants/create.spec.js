"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../../../src/config/data-source");
const mock_jwks_1 = __importDefault(require("mock-jwks"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../src/app"));
const Tenant_1 = require("../../../src/entity/Tenant");
const constants_1 = require("../../../src/constants");
describe('POST /tenants', () => {
    let connection;
    let jwks;
    let adminToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //jest.setTimeout(70000);
        connection = yield data_source_1.AppDataSource.initialize();
        jwks = (0, mock_jwks_1.default)('http://localhost:5555');
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.dropDatabase();
        yield connection.synchronize();
        jwks.start();
        adminToken = jwks.token({
            sub: '1',
            role: constants_1.Roles.ADMIN,
        });
        //await truncateTables(connection);
    }));
    afterEach(() => {
        jwks.stop();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.destroy();
    }));
    describe('Given all fields', () => {
        it.skip('should return a 201 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            };
            //Act
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);
            expect(response.statusCode).toBe(201);
        }));
        it.skip('should create a tenant in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantData = {
                name: 'Tenant nameq',
                address: 'Tenant address',
            };
            yield (0, supertest_1.default)(app_1.default).post('/tenants').send(tenantData);
            //Act
            const tenantRepository = connection.getRepository(Tenant_1.Tenant);
            const tenants = yield tenantRepository.find();
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
        }));
        it.skip('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            adminToken = jwks.token({
                sub: '1',
                role: constants_1.Roles.MANAGER,
            });
            const tenantData = {
                name: 'Tenant nameq',
                address: 'Tenant address',
            };
            const response = yield (0, supertest_1.default)(app_1.default).post('/tenants').send(tenantData);
            //Act
            expect(response.statusCode).toBe(401);
        }));
        it.skip('should return 403 if user is not an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const managerToken = jwks.token({
                sub: '1',
                role: constants_1.Roles.MANAGER,
            });
            const tenantData = {
                name: 'Tenant nameq',
                address: 'Tenant address',
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(tenantData);
            //Act
            expect(response.statusCode).toBe(403);
        }));
    });
});
