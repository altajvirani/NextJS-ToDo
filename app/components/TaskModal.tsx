import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Task } from "../types";

interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  taskInputRef: React.RefObject<any>;
  addTask: () => void;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  toBeEditedTask?: Task;
  editTask?: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onOpenChange,
  taskInputRef,
  addTask,
  isEdit,
  setIsEdit,
  toBeEditedTask,
  editTask,
}) => {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        if (!isOpen) {
          setIsEdit(false);
          taskInputRef.current.value = "";
        }
      }}
      placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "Edit Task" : "Add Task"}
            </ModalHeader>
            <ModalBody className="p-6">
              <Input
                autoFocus
                label="Task"
                placeholder="Eg. Complete homework"
                ref={taskInputRef}
                defaultValue={isEdit ? toBeEditedTask!.title : ""}
              />
            </ModalBody>
            <ModalFooter className="p-0 mx-0 mb-6 mr-6">
              <Button
                color="primary"
                variant="shadow"
                onPress={() => {
                  if (taskInputRef.current.value != "") onClose();
                }}
                onClick={() => {
                  if (isEdit) editTask!(toBeEditedTask!);
                  else if (taskInputRef.current.value != "") addTask();
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
