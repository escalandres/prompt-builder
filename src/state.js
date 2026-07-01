export const STORAGE_KEY="xml-prompt-builder";

export const defaultState={
persona:"",
job:"",
task:"",
input:"{{input}}",
output:"",
constraints:[""],
variables:[]
};

let state=structuredClone(defaultState);

export function getState(){
return state;
}

export function setState(newState){
state={
...state,
...newState
};
saveState();
return state;
}

export function resetState(){
state=structuredClone(defaultState);
saveState();
return state;
}

export function loadState(){
const raw=localStorage.getItem(STORAGE_KEY);
if(!raw){
state=structuredClone(defaultState);
return state;
}

try{
const saved=JSON.parse(raw);
state={
...structuredClone(defaultState),
...saved
};
}
catch{
state=structuredClone(defaultState);
}

return state;
}

export function saveState(){
localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}

export function updateField(field,value){
state[field]=value;
saveState();
return state;
}

export function addConstraint(value=""){
state.constraints.push(value);
saveState();
}

export function updateConstraint(index,value){
if(index<0||index>=state.constraints.length)return;
state.constraints[index]=value;
saveState();
}

export function removeConstraint(index){
if(index<0||index>=state.constraints.length)return;
state.constraints.splice(index,1);
if(state.constraints.length===0){
state.constraints.push("");
}
saveState();
}

export function addVariable(name="",value=""){
state.variables.push({name,value});
saveState();
}

export function updateVariable(index,key,value){
if(index<0||index>=state.variables.length)return;
state.variables[index][key]=value;
saveState();
}

export function removeVariable(index){
if(index<0||index>=state.variables.length)return;
state.variables.splice(index,1);
saveState();
}