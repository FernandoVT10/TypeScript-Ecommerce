import setupTestDB from "./setupTestDB";
import mockAuthentication from "./mockAuthentication";

jest.setTimeout(30000);

global.setupTestDB = setupTestDB;
global.mockAuthentication = mockAuthentication;
