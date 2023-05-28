const COUNT = 10000000;
const SEARCH_NUMBER = 15563;
let array = [];

for (let i = 0; i < COUNT; i++) {
    array[i] = i;
}

let set = new Set(array);

//FIRST ELEMENT
// Создаем временные метки для каждой операции
performance.mark("start-add-arr-unshift");
//adds the specified elements to the beginning
array.unshift(COUNT);
performance.mark("end-add-arr-unshift");

//delete
performance.mark("start-del-arr-shift");
//removes the first element
array.shift()
performance.mark("end-del-arr-shift");


//LAST ELEMENT
performance.mark("start-add-arr-push");
//adds the specified elements to the end 
array.push(COUNT);
performance.mark("end-add-arr-push");

// add in set
performance.mark("start-set-add");
set.add(COUNT)
performance.mark("end-set-add");




//DELETE
performance.mark("start-del-arr-pop");
//removes the last element
array.pop()
performance.mark("end-del-arr-pop");

// remove in set
performance.mark("start-set-del");
set.delete(COUNT)
performance.mark("end-set-del");


//SEARCH
performance.mark("start-arr-indexOf");
array.indexOf(SEARCH_NUMBER);
performance.mark("end-arr-indexOf");

performance.mark("start-set-has");
set.has(SEARCH_NUMBER);
performance.mark("end-set-has");



performance.measure("add-arr-unshift", "start-add-arr-unshift", "end-add-arr-unshift");
const executionTime1 = performance.getEntriesByName("add-arr-unshift")[0].duration;
console.log("Время выполнения операции arr.unshift(): " + executionTime1 + " миллисекунд");

performance.measure("del-arr-shift", "start-del-arr-shift", "end-del-arr-shift");
const executionTime2 = performance.getEntriesByName("del-arr-shift")[0].duration;
console.log("Время выполнения операции arr.shift(): " + executionTime2 + " миллисекунд");

performance.measure("add-arr-push", "start-add-arr-push", "end-add-arr-push");
const executionTime3 = performance.getEntriesByName("add-arr-push")[0].duration;
console.log("Время выполнения операции arr.push(): " + executionTime3 + " миллисекунд");

performance.measure("set-add", "start-set-add", "end-set-add");
const executionTime4 = performance.getEntriesByName("set-add")[0].duration;
console.log("Время выполнения операции set.add(): " + executionTime4 + " миллисекунд");

performance.measure("del-arr-pop", "start-del-arr-pop", "end-del-arr-pop");
const executionTime5 = performance.getEntriesByName("del-arr-pop")[0].duration;
console.log("Время выполнения операции arr.pop(): " + executionTime5 + " миллисекунд");

performance.measure("set-del", "start-set-del", "end-set-del");
const executionTime6 = performance.getEntriesByName("set-del")[0].duration;
console.log("Время выполнения операции set.delete(): " + executionTime6 + " миллисекунд");

performance.measure("arr-indexOf", "start-arr-indexOf", "end-arr-indexOf");
const executionTime7 = performance.getEntriesByName("arr-indexOf")[0].duration;
console.log("Время выполнения операции arr.indexOf(): " + executionTime7 + " миллисекунд");

performance.measure("set-has", "start-set-has", "end-set-has");
const executionTime8 = performance.getEntriesByName("set-has")[0].duration;
console.log("Время выполнения операции set.has(): " + executionTime8 + " миллисекунд");

