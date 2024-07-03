// 유저가 값을 입력한다
// + 버튼을 클릭하면, 할 일이 추가된다
// delete 버튼을 누르면 할 일이 삭제된다
// check 버튼을 누르면 할 일이 끝나면서 밑줄이 간다
// 1. check 버튼을 클릭하는 순간 false -> true로 바뀌어야 한다
// 2. true이면 끝난 걸로 간주하고 밑줄이 생긴다
// 진행 중 끝남 탭을 누르면, 언더바가 이동한다
// 끝남 탭은 끝난 할 일만, 진행 중 탭은 진행 중인 아이템만
// 전체탭을 누르면 다시 전체 아이템으로 돌아옴


let underLine = document.getElementById("under-line");
let tabs = document.querySelectorAll(".task-taps div");

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let taskList = [];
let deleteTask = [];

let allTask = document.querySelector(".all");
let doTask = document.querySelector(".do");


 // tab 클릭 시 언더라인 이동 및 탭 변경
tabs.forEach((tab) => 
  tab.addEventListener("click", (e) => {
    underLineMove(e)
    tabChange(e)
  })
);

const underLineMove = (e) => {
  // 이벤트의 타켓이 span이 아닐 때만 실행
  let target = e.target;
  if (target.tagName.toLowerCase() === 'span') {
    target = target.parentElement;
  }

  underLine.style.left = target.offsetLeft + "px";
  underLine.style.width = target.offsetWidth + "px";
  underLine.style.transition = "0.5s";
}

const tabChange = (e) => {
  // 다른 탭의 category-active 클래스 제거
  tabs.forEach(tab => {
    tab.classList.remove("category-active");
    let tabText = tab.querySelector("span");
    if (tabText) {
      tabText.classList.remove("active");
    }
  });
  
  // 클릭한 탭의 category-active 클래스 추가
  let target = e.target;

  if (target.tagName.toLowerCase() === 'span')  {
    target = target.parentElement;
  }
  target.classList.add("category-active");

  // 클릭한 탭의 자식 span에 active 클래스 추가
  let targetText = target.querySelector("span");
  if(targetText) {
    targetText.classList.add("active");
  }
}


const addTask = () => {
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  }

  // 입력값이 있을 때만 추가
  if (task.taskContent !== "") {
    taskList.push(task);
    console.log(taskList);
    render();
    // 입력창 초기화
    taskInput.value = "";
  }
}

const render = () => {
  let resultHtml = "";
  for(let i = 0; i < taskList.length; i++) {
    if (taskList[i].isComplete == true) {
      resultHtml += `
        <div class="task done-color">
          <div class="task-done">${taskList[i].taskContent}</div>
          <div class="button-wrap">
            <button class="check check-done" onclick="toggleComplete('${taskList[i].id}')"><i class="fa-solid fa-rotate-left"></i></button>
            <button class="delete" onclick="taskDelete('${taskList[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>`;
    } else {
      resultHtml += `
      <div class="task">
        <div>${taskList[i].taskContent}</div>
        <div class="button-wrap">
          <button class="check" onclick="toggleComplete('${taskList[i].id}')"><i class="fa-solid fa-check"></i></button>
          <button class="delete" onclick="taskDelete('${taskList[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = resultHtml;
  allTask.textContent = `${taskList.length}`;
  doTask.textContent = `${taskList.length}`;
}

// 할 일 완료
const toggleComplete = (id) => {
  for(let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render();
}

// 할 일 삭제
const taskDelete = (id) => {

  for(let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      // 삭제된 항목을 저장
      let removedTask = taskList.splice(i, 1); 
      // 삭제된 항목을 deleteTask에 저장
      deleteTask.push(...removedTask);
      break;
    }
  }
  render();
}

// + 버튼 클릭 시 할 일 추가
addButton.addEventListener("click", addTask)

// 엔터키 입력 시 할 일 추가
taskInput.addEventListener("keyup", (e) => {
  if (e.key === 'Enter') {
    // 엔터키 기본 동작 방지
    e.preventDefault();
    addTask();
  }
});

// 랜덤 아이디 생성
const randomIDGenerate = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
}