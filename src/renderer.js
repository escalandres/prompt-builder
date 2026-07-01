import {getState} from "./state.js";

export function renderPreview(previewElement){
if(!previewElement)return;
previewElement.textContent=buildXml();
}

export function buildXml(){
const state=getState();

const persona=escapeXml(state.persona.trim());
const job=escapeXml(state.job.trim());
const task=escapeXml(state.task.trim());
const input=escapeXml(state.input.trim());
const output=escapeXml(state.output.trim());

const constraints=buildConstraints(state.constraints);
const variables=buildVariables(state.variables);

let xml=`<role>
You are a ${persona}. Your job is to ${job}.
</role>

<task>
${task}
</task>

<constraints>
${constraints}
</constraints>

<input>
${input}
</input>

<output_format>
${output}
</output_format>`;

if(variables){
xml+=`

<variables>
${variables}
</variables>`;
}

return formatXml(xml);
}

function buildConstraints(items){
return items
.filter(item=>item.trim().length>0)
.map(item=>`- ${escapeXml(item.trim())}`)
.join("\n");
}

function buildVariables(items){
return items
.filter(item=>item.name.trim()||item.value.trim())
.map(item=>`- ${escapeXml(item.name.trim())} = ${escapeXml(item.value.trim())}`)
.join("\n");
}

export function escapeXml(text=""){
return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&apos;");
}

export function formatXml(xml){
return xml
.replace(/[ \t]+\n/g,"\n")
.replace(/\n{3,}/g,"\n\n")
.trim();
}

export function copyXml(){
return navigator.clipboard.writeText(buildXml());
}

export function downloadXml(filename="prompt.xml.txt"){
const blob=new Blob([buildXml()],{type:"text/plain;charset=utf-8"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download=filename;
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);
}