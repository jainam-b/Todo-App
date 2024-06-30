import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from '@mantine/core';
import { useState, useEffect, useCallback } from 'react';
import { MoonStars, Sun, Trash, Edit, Check } from 'tabler-icons-react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage, useHotkeys } from '@mantine/hooks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSummary, setTaskSummary] = useState('');

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = useCallback(
    (value) =>
      setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark')),
    [colorScheme, setColorScheme]
  );

  const createTask = useCallback(() => {
    const newTask = { title: taskTitle, summary: taskSummary, completed: false };
    const updatedTasks = editIndex === null ? [...tasks, newTask] : tasks.map((task, index) => index === editIndex ? newTask : task);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditIndex(null);
    setTaskTitle('');
    setTaskSummary('');
  }, [tasks, taskTitle, taskSummary, editIndex]);

  const deleteTask = useCallback(
    (index) => {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    },
    [tasks]
  );

  const editTask = useCallback((index) => {
    setEditIndex(index);
    const task = tasks[index];
    setTaskTitle(task.title);
    setTaskSummary(task.summary);
    setOpened(true);
  }, [tasks]);

  const markAsCompleted = useCallback((index) => {
    const updatedTasks = tasks.map((task, i) => i === index ? { ...task, completed: true } : task);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }, [tasks]);

  const loadTasks = useCallback(() => {
    const loadedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (loadedTasks) {
      setTasks(loadedTasks);
    }
  }, []);

  const saveTasks = useCallback((tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, defaultRadius: 'md' }} withGlobalStyles withNormalizeCSS>
        <div
          className="App"
         
        >
          <Modal
            opened={opened}
            size="md"
            title={editIndex === null ? "New Task" : "Edit Task"}
            onClose={() => setOpened(false)}
            centered
          >
            <TextInput
              mt="md"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.currentTarget.value)}
              placeholder="Task Title"
              required
              label="Title"
            />
            <TextInput
              mt="md"
              value={taskSummary}
              onChange={(event) => setTaskSummary(event.currentTarget.value)}
              placeholder="Task Summary"
              label="Summary"
            />
            <Group mt="md" position="apart">
              <Button onClick={() => setOpened(false)} variant="subtle">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                  setOpened(false);
                }}
              >
                {editIndex === null ? "Create Task" : "Save Changes"}
              </Button>
            </Group>
          </Modal>
          <Container
            size={550}
            my={40}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Group position="apart" style={{ width: '100%' }}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon color="blue" onClick={() => toggleColorScheme()} size="lg">
                {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Card withBorder key={index} mt="sm" style={{ width: '100%' }}>
                  <Group position="apart">
                    <Text weight="bold" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </Text>
                    <Group>
                      <ActionIcon
                        onClick={() => editTask(index)}
                        color="blue"
                        variant="transparent"
                      >
                        <Edit />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color="red"
                        variant="transparent"
                      >
                        <Trash />
                      </ActionIcon>
                      {!task.completed && (
                        <ActionIcon
                          onClick={() => markAsCompleted(index)}
                          color="green"
                          variant="transparent"
                        >
                          <Check />
                        </ActionIcon>
                      )}
                    </Group>
                  </Group>
                  <Text color="dimmed" size="md" mt="sm" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.summary || 'No summary was provided for this task'}
                  </Text>
                </Card>
              ))
            ) : (
              <Text size="lg" mt="md" color="dimmed">
                You have no tasks
              </Text>
            )}
            <Button onClick={() => setOpened(true)} fullWidth mt="md">
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
