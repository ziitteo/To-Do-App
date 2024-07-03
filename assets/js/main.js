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
let taskList = [];  // 전체 할 일 목록

let mode = "all";  // 현재 필터 모드 (all, do, done, deleted)
let filterList = [];  // 필터링된 할 일 목록

let allTask = document.querySelector(".all");
let doTask = document.querySelector(".do");
let doneTask = document.querySelector(".done");
let deletedTask = document.querySelector(".delete");

// 초기 버튼 비활성화
addButton.disabled = true;

// 입력 필드 감시 및 버튼 활성화 함수
taskInput.addEventListener("input", function() {
  if (taskInput.value.trim() === "") {
    addButton.disabled = true;
  } else {
    addButton.disabled = false;
  }
});

// 할 일 추가 함수
const addTask = () => {
  let task = {
    id: randomIDGenerate(),  // 랜덤 아이디 생성
    taskContent: taskInput.value,  // 할 일 내용
    isComplete: false,  // 완료 여부
    isDelete: false,  // 삭제 여부
    isCompleteDelete: false,  // 영구 삭제 여부
  }

  // 입력값이 있을 때만 할 일 추가
  if (task.taskContent !== "") {
    taskList.push(task);
    taskInput.value = "";  // 입력창 초기화
    addButton.disabled = true;
    filterTasks();  // 현재 모드에 맞게 필터링
    render();  // 필터링된 목록 렌더링
  }
}

// 렌더링 함수
const render = () => {
  let list = filterList;

  // 각 탭의 할 일 갯수 업데이트
  allTask.textContent = `${taskList.filter(task => !task.isDelete).length}`;
  doTask.textContent = `${taskList.filter(task => !task.isComplete && !task.isDelete).length}`;
  doneTask.textContent = `${taskList.filter(task => task.isComplete && !task.isDelete).length}`;
  deletedTask.textContent = `${taskList.filter(task => task.isDelete).length}`;

  let resultHtml = "";
  for (let i = 0; i < list.length; i++) {
    // 삭제되지 않은 할 일
    if (list[i].isDelete === false) {
      if (list[i].isComplete == true) {
        resultHtml += `
          <div class="task done-color">
            <div class="task-done">${list[i].taskContent}</div>
            <div class="button-wrap">
              <button class="check check-done" onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-rotate-left"></i></button>
              <button class="delete" onclick="taskDelete('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>`;
      } else {
        resultHtml += `
          <div class="task">
            <div>${list[i].taskContent}</div>
            <div class="button-wrap">
              <button class="check" onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-check"></i></button>
              <button class="delete" onclick="taskDelete('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>`;
      }
    } else {
      // 삭제된 할 일
      resultHtml += `
      <div class="task task-delete">
        <div>${list[i].taskContent}</div>
        <div class="button-wrap">
          <button class="check check-done" onclick="taskBack('${list[i].id}')"><i class="fa-solid fa-rotate-left"></i></button>
          <button class="delete" onclick="taskCompleteDelete('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = resultHtml;  // 할 일 목록을 화면에 렌더링
}

// 할 일 완료 상태 토글 함수
const toggleComplete = (id) => {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;  // 완료 상태 토글
      break;
    }
  }
  filterTasks();  // 현재 모드에 맞게 필터링 후 렌더링
  render();
}

// 할 일 삭제 함수
const taskDelete = (id) => {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isDelete = true;  // 삭제 상태로 변경
      break;
    }
  }
  filterTasks();  // 현재 모드에 맞게 필터링 후 렌더링
  render();
}

// 삭제된 할 일 복구 함수
const taskBack = (id) => {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isDelete = false;  // 삭제 상태 해제
      break;
    }
  }
  filterTasks();  // 현재 모드에 맞게 필터링 후 렌더링
  render();
}

// 삭제된 할 일 영구 삭제 함수
const taskCompleteDelete = (id) => {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList.splice(i, 1);  // 리스트에서 완전히 제거
      break;
    }
  }
  filterTasks();  // 현재 모드에 맞게 필터링 후 렌더링
  render();
}

// 할 일 필터링 함수
const filterTasks = () => {
  filterList = [];

  if (mode === "all") {
    // 전체 리스트를 보여준다
    // task.isDelete가 false인 것만 보여준다
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isDelete === false) {
        filterList.push(taskList[i]);
      }
    }
  } else if (mode === "do") {
    // 진행 중인 리스트만 보여준다
    // task.isComplete가 false인 것만 보여준다
    // task.isDelete가 false인 것만 보여준다
    for(let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false && taskList[i].isDelete === false) {
        filterList.push(taskList[i]);
      }
    }
  } else if (mode === "done") {
    // 완료된 리스트만 보여준다
    // task.isComplete가 true인 것만 보여준다
    // task.isDelete가 false인 것만 보여준다
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === true && taskList[i].isDelete === false) {
        filterList.push(taskList[i]);
      }
    }
  } else if (mode === "deleted") {
    // 삭제된 리스트만 보여준다
    // task.isDelete가 true인 것만 보여준다
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isDelete === true && taskList[i].isCompleteDelete === false) {
        filterList.push(taskList[i]);
      }
    }
  }
}

// 탭 클릭 시 필터링 함수
const filterTask = (e) => {
  let target = e.target;
  if (target.tagName.toLowerCase() === 'span') {
    target = target.parentElement;
  }

  mode = target.id;
  filterTasks();
  render();
} 

// 탭 클릭 시 언더라인 이동 함수
const underLineMove = (e) => {
  let target = e.target;
  if (target.tagName.toLowerCase() === 'span') {
    target = target.parentElement;
  }

  underLine.style.left = target.offsetLeft + "px";
  underLine.style.width = target.offsetWidth + "px";
  underLine.style.transition = "0.5s";
}

// 탭 클릭 시 탭 변경 함수
const tabChange = (e) => {
  tabs.forEach(tab => {
    tab.classList.remove("category-active");
    let tabText = tab.querySelector("span");
    if (tabText) {
      tabText.classList.remove("active");
    }
  });

  let target = e.target;
  if (target.tagName.toLowerCase() === 'span') {
    target = target.parentElement;
  }
  target.classList.add("category-active");

  let targetText = target.querySelector("span");
  if (targetText) {
    targetText.classList.add("active");
  }
}

// + 버튼 클릭 시 할 일 추가
addButton.addEventListener("click", addTask);

// 엔터키 입력 시 할 일 추가
taskInput.addEventListener("keyup", (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
});

// 탭 클릭 시 언더라인 이동 및 탭 변경
for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", (e) => {
    filterTask(e);
    underLineMove(e);
    tabChange(e);
  });
}

// 랜덤 아이디 생성
const randomIDGenerate = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
}