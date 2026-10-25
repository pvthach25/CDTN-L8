const test=require('node:test');
const assert=require('node:assert/strict');
const Module=require('node:module');
const originalLoad=Module._load;
Module._load=function(request,parent,isMain){if(request==='pg')return {Pool:class {on(){} query(){throw new Error('DB should be mocked in unit tests');}}};return originalLoad.apply(this,arguments);};
const repo=require('../src/repositories/surveyResponseRepository');
Module._load=originalLoad;
const service=require('../src/services/surveyResponseService');
const originals={...repo};
function mock(changes){Object.assign(repo,originals,changes);}
test.afterEach(()=>Object.assign(repo,originals));
test('CSAT lower bound 1 and NPS lower bound 0 are valid',async()=>{mock({findTicket:async()=>({status:'CLOSED'}),create:async(d)=>d});const r=await service.create({ticket_id:1,csat_score:1,nps_score:0});assert.equal(r.nps_score,0);});
test('CSAT upper bound 5 and NPS upper bound 10 are valid',async()=>{mock({findTicket:async()=>({status:'CLOSED'}),create:async(d)=>d});const r=await service.create({ticket_id:1,csat_score:5,nps_score:10});assert.equal(r.csat_score,5);});
test('Reject CSAT 6',async()=>{await assert.rejects(service.create({ticket_id:1,csat_score:6,nps_score:5}),{status:400});});
test('Reject NPS -1',async()=>{await assert.rejects(service.create({ticket_id:1,csat_score:4,nps_score:-1}),{status:400});});
test('Reject non-closed ticket',async()=>{mock({findTicket:async()=>({status:'OPEN'})});await assert.rejects(service.create({ticket_id:1,csat_score:4,nps_score:8}),{status:400});});
test('Reject unknown ticket',async()=>{mock({findTicket:async()=>null});await assert.rejects(service.create({ticket_id:99,csat_score:4,nps_score:8}),{status:404});});
test('Reject missing survey',async()=>{mock({findById:async()=>null});await assert.rejects(service.getById(999),{status:404});});
test('Reject non-string comment',async()=>{await assert.rejects(service.create({ticket_id:1,csat_score:4,nps_score:8,comment:123}),{status:400});});
