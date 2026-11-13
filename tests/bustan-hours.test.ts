import assert from "node:assert/strict";
import test from "node:test";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {bustanHours,bustanPeriods} from "../src/content/bustan-hours.ts";
import {goCopy} from "../src/content/go-redesign.ts";
import {publicV1Content,translationPackages} from "../src/saweeg-global/validation.ts";
import {localeCodes} from "../src/saweeg-global/locales.ts";

test("Bustan morning excludes Friday and evening remains daily in all ten public languages",()=>{
  assert.deepEqual(bustanPeriods.ar,[["الفترة الصباحية","من السبت إلى الخميس، من ٦ صباحًا إلى ١٢ ظهرًا."],["الفترة المسائية","يوميًا، من ٤:٣٠ عصرًا إلى ١١:٣٠ مساءً."]]);
  assert.deepEqual(bustanPeriods.en,[["Morning","Saturday to Thursday, from 6:00 AM to noon."],["Evening","Daily, from 4:30 PM to 11:30 PM."]]);
  assert.deepEqual(goCopy.ar.schedules.bustan,bustanPeriods.ar);
  assert.deepEqual(goCopy.en.schedules.bustan,bustanPeriods.en);
  assert.deepEqual([...Object.keys(bustanHours)].sort(),[...localeCodes].sort());
  for(const locale of localeCodes){
    const live=publicV1Content(locale),source=translationPackages[locale]!.content;
    assert.equal(live["world.branches.bustan.hours"],bustanHours[locale]);
    for(const key of Object.keys(live))if(key!=="world.branches.bustan.hours")assert.equal(live[key as keyof typeof live],source[key],locale+":"+key);
  }
});

test("Hours correction preserves other branches, all menu data and all design files",()=>{
  const baseline="d4bd224a05927674768f701d0ed9278b9190fb8c";
  const paths=["src/menu","src/config","src/styles","src/components","src/data","src/i18n","src/pages","assets-source"];
  const files=execFileSync("git",["-c","core.quotePath=false","ls-tree","-r","--name-only",baseline,...paths],{encoding:"utf8"}).trim().split("\n");
  const digest=(bytes:Buffer)=>createHash("sha256").update(bytes).digest("hex");
  for(const file of files){
    const previous=execFileSync("git",["show",baseline+":"+file],{maxBuffer:64*1024*1024});
    assert.equal(digest(readFileSync(file)),digest(previous),file);
  }
});
