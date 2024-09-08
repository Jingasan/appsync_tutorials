import React from "react";
import { Amplify, ResourcesConfig } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "./aws-exports";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { listTodos } from "./graphql/queries";
import { createTodo } from "./graphql/mutations";
import { ListTodosQuery, CreateTodoMutation } from "./API";

// AppSync接続初期化
Amplify.configure(config as ResourcesConfig);

// GraphQL APIの実行クライアント
const client = generateClient();

function App() {
  const [todoList, setTodoList] = React.useState<ListTodosQuery | undefined>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * TODOリストの取得
   */
  const fetchTodoList = async () => {
    const todos = (await client.graphql({
      query: listTodos,
    })) as GraphQLResult<ListTodosQuery>;
    setTodoList(todos.data);
  };

  /**
   * TODOリストの初回取得
   */
  React.useEffect(() => {
    fetchTodoList();
  }, []);

  /**
   * TODOの追加
   * @returns
   */
  const createTodoList = async () => {
    if (!inputRef.current) {
      alert("入力がありません。");
      return;
    }
    (await client.graphql({
      query: createTodo,
      variables: {
        input: {
          name: inputRef.current.value,
        },
      },
    })) as GraphQLResult<CreateTodoMutation>;

    fetchTodoList();
  };

  return (
    <div>
      <div>
        <input name="name" ref={inputRef} type="text" />
        <button onClick={createTodoList}>保存</button>
      </div>
      {todoList?.listTodos?.items?.map((item) => {
        return (
          <>
            <div>id: {item?.id}</div>
            <div>name: {item?.name}</div>
            <br />
          </>
        );
      })}
    </div>
  );
}

export default App;
