// 유저가 값을 입력한다
// + 버튼을 클릭하면, 할 일이 추가된다
// delete 버튼을 누르면 할 일이 삭제된다
// check 버튼을 누르면 할 일이 끝나면서 밑줄이 간다
// 진행 중 끝남 탭을 누르면, 언더바가 이동한다
// 끝남 탭은 끝난 할 일만, 진행 중 탭은 진행 중인 아이템만
// 전체탭을 누르면 다시 전체 아이템으로 돌아옴

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let taskList = [];

let allTask = document.querySelector(".all");

const addTask = () => {
  let taskContent = taskInput.value;

  // 입력값이 있을 때만 추가
  if (taskContent !== "") {
    taskList.push(taskContent);
    console.log(taskList);
    render();
    // 입력창 초기화
    taskInput.value = "";
  }
}

const render = () => {
  let resultHtml = "";
  for(let i = 0; i < taskList.length; i++) {
    resultHtml += `
        <div class="task">
          <div>${taskList[i]}</div>
          <div>
            <button class="check">Check </button>
            <button class="delete">Delete</button>
          </div>
        </div>
    `;
  }
  document.getElementById("task-board").innerHTML = resultHtml;
  allTask.textContent = `${taskList.length}`;
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

