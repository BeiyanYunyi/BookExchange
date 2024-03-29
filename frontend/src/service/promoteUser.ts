import axiosClient from './axiosClient';

const promoteUser = async (userID: string) =>
  axiosClient.client.patch(`/api/user/${userID}`).json();

export default promoteUser;
