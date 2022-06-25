import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useToast
} from "@chakra-ui/react";
import ReactAvatarEditor from "react-avatar-editor";
import React, { useRef, useState } from "react";
import { storage } from "../firebase";
import {ref, uploadBytes} from 'firebase/storage'
import { useQuery } from "react-query";
import { getToken, tokenQueryId } from "../queries/token";
import { readUserQuery, userQueryId } from "../queries/user";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  resetUseAnimateAVatar: () => void;
}

function dataURItoBlob(dataURI:string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

export default function AvatarPicker(props: Props) {
  const editor = useRef<any>(null);
  const toast = useToast()
  const {
    isLoading: isLoadingToken,
    error: tokenError,
    data: token,
  } = useQuery(tokenQueryId, getToken);
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: user,
  } = useQuery(userQueryId, readUserQuery(token!), {
    enabled: !!token?.authTime,
  });
  const [state, setState] = useState({
    image: new File(["foo"], "foo.jpg"),
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 100,
    preview: null,
    width: 200,
    height: 200,
  });
  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files?.length > 0)
      setState({ ...state, image: e.target.files[0] });
  };
  const handleUpdate = () => {
    if (editor && editor.current) {
        const canvas = editor.current.getImageScaledToCanvas()
        const dataURL = canvas.toDataURL('image/png')
        const blob = dataURItoBlob(dataURL)
        const location = ref(storage, `avatars/${user?.body.UID}`)
        uploadBytes(location, blob).then(res => {
          toast({
            title: "avatar uploaded",
            duration: 2000,
            status: "success"
          })
          props.onClose();
        })
        .catch(err => {
          console.error(err);
          toast({
            title: "error uploading avatar",
            duration: 2000,
            status: "error"
          })
        })
    }
  };
  const handleClose = () => {
    props.resetUseAnimateAVatar();
    props.onClose();
  };
  return (
    <Modal isOpen={props.isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload avatar</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="w-full flex items-center flex-col">
          <ReactAvatarEditor
            ref={editor}
            {...state}
            onPositionChange={(e) => setState({ ...state, position: e })}
          />
          <FormControl>
            <FormLabel>zoom</FormLabel>
            <Slider
              max={2}
              step={0.01}
              value={state.scale}
              onChange={(e) => setState({ ...state, scale: e })}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>
          <FormControl>
            <FormLabel>upload avatar</FormLabel>
            <Input type="file" onChange={handleUploadImage} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" colorScheme={"blue"} onClick={handleUpdate}>
            update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
