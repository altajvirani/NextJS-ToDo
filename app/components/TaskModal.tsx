import React, { useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Task } from "../types";

interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  taskTitleRef: React.RefObject<any>;
  taskDescRef: React.RefObject<any>;
  addTask: () => void;
  addTaskBtnRef: React.RefObject<HTMLButtonElement>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  toBeEditedTask?: Task;
  setToBeEditedTask: React.Dispatch<React.SetStateAction<any>>;
  editTask?: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onOpenChange,
  taskTitleRef,
  taskDescRef,
  addTask,
  addTaskBtnRef,
  isEdit,
  setIsEdit,
  toBeEditedTask,
  setToBeEditedTask,
  editTask,
}) => {
  useEffect(() => {
    if (!isOpen) {
      setIsEdit(false);
      setToBeEditedTask(undefined);
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={() => onOpenChange()}
      placement="top-center"
      className="m-6">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "Edit Task" : "Add Task"}
            </ModalHeader>
            <ModalBody className="p-6">
              <Input
                autoFocus
                isRequired
                variant="faded"
                label="Title"
                placeholder="Eg. Complete homework"
                ref={taskTitleRef}
                maxLength={40}
                defaultValue={isEdit ? toBeEditedTask!.title : ""}
                onKeyDown={(e) => {
                  const descTxtArea = taskDescRef.current;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    descTxtArea.focus();
                    descTxtArea.setSelectionRange(
                      descTxtArea.value.length,
                      descTxtArea.value.length
                    );
                  }
                }}
              />
              <Textarea
                variant="faded"
                label="Description"
                placeholder="Eg. Finish quadratic equations and mensuration assignments"
                ref={taskDescRef}
                maxLength={150}
                defaultValue={isEdit ? toBeEditedTask!.description : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTaskBtnRef.current?.click();
                }}
              />
            </ModalBody>
            <ModalFooter className="p-0 mx-0 mb-6 mr-6">
              <Button
                ref={addTaskBtnRef}
                color="primary"
                variant="shadow"
                onPress={() => {
                  if (taskTitleRef.current.value.trim().length != 0) onClose();
                }}
                onClick={(e) => {
                  e.currentTarget.disabled = true;
                  if (isEdit) editTask!(toBeEditedTask!);
                  else if (taskTitleRef.current.value.trim().length != 0)
                    addTask();
                }}>
                Go
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
