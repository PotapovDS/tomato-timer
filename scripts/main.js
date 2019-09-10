// разделить работу приложения на 3 фазы
// фааза выбора задачи, рабочая фаза = 25 минут работы четчика,
//фаза отдыха = 5 - 20 минут работы счетчика
'use strict';
const TIME_TO_WORK = 14000;
const TIME_TO_LITTLE_REST = 15000;
const TIME_TO_BIG_REST = 15000;
// const TIME_TO_WORK = 1499000; //25 минут в мс
// const TIME_TO_LITTLE_REST = 300000; // 5 минут в милисекундах
// const TIME_TO_BIG_REST = 900000; // 15 минут в мс
const PHASE_REST = 'rest';
const PHASE_WORK = 'work';
const PHASE_STOP = 'stop';
const DEFAULT_TASK = 'Выберите задачу'

var activePhase = PHASE_STOP;
var activeTask = DEFAULT_TASK;
var time = TIME_TO_WORK; // глобальная переменная, нужен глобальный доступ
//чтобы была возможность сброса таймера из других функций
var timerId;
var counter = 1; // отсчет количества выполненных помидоров

function chooseActiveTask(e) {
   $(".active-task-item").attr("class", "task-item");
   var newActiveTask = $(e.target).closest(".task-item");
   newActiveTask.attr("class", "active-task-item");
   var newActiveTaskName = newActiveTask.find(".task-name").text();
   if (newActiveTaskName !== activeTask) {
      $(".active-task h1").text(newActiveTaskName);
      activeTask = newActiveTaskName;
      stopTimer();
   }
}

function addTask() {
   var newTask = prompt('Введите задачу');
   $(".task-item:last").clone(true).appendTo(".task-list");
   $(".task-item:last .task-name").text(newTask);
}


function deleteTask(e) {
   if ($(".task-list li").length === 1) {
      alert("в списке должна оставаться хотябы одна задача");
      return;
   }
   var task = $(e.target);
   task.parent().remove();
}

function endTask() {
   activeTask = DEFAULT_TASK;
   $(".active-task h1").text(activeTask);
   $(".active-task-item").remove();
}

function startTimer() {
   if (activeTask === DEFAULT_TASK) {
      alert('Сначала выберите задачу, которую будете выполнять');
      return
   } else {
      activePhase = PHASE_WORK;
      counter = 1;
      timerId = setInterval(timer, 1000);
   }
}

function timer() {
   var countdown = new Date(time);
   $(".timer").empty();
   $(".timer")
      .append("<div>" + countdown.getMinutes() +
         " : " + countdown.getSeconds() + "</div>");

   if (time === 0) {
      if (activePhase === PHASE_WORK) {
         addTomato();
         if (counter < 4) {
            alert('Отдохните немного');
            activePhase = PHASE_REST;
            time = TIME_TO_LITTLE_REST;
            counter++;
         } else {
            alert('Одохните побольше');
            time = TIME_TO_BIG_REST;
            counter = 1;
         }
      } else {
         alert('Вернитесь к задаче');
         time = TIME_TO_WORK;
         activePhase = PHASE_WORK;
      }
   } else {
      time -= 1000;
   }

}

function stopTimer() {
   time = TIME_TO_WORK;
   activePhase = PHASE_STOP;
   clearInterval(timerId);
}

function addTomato() {
   var tomatoes = $(".active-task-item .badge").text();
   console.log(tomatoes);
   $(".active-task-item .badge").text(++tomatoes);
}

$(document).ready(function() {
   $(".add-task").click(addTask);
   $("#button-start").click(startTimer);
   $("#button-stop").click(stopTimer);
   $("#button-end").click(endTask);
   $(".task-item").click((e) => chooseActiveTask(e));
   $(".close-task").click((e) => deleteTask(e));
})
