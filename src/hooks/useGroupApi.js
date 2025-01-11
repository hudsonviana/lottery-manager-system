import useAuthApiClient from './useAuthApiClient';

const useGroupApi = () => {
  const authApiClient = useAuthApiClient();

  const fetchGroups = async () => {
    const response = await authApiClient.get('/groups');
    console.log(response);
    return response.data.groups;
  };

  const fetchGroup = async (id) => {
    const response = await authApiClient.get(`/groups/${id}`);
    return response.data.group;
  };

  const addGroup = async (groupData) => {
    const response = await authApiClient.post('/groups', groupData);
    return response.data;
  };

  const updateGroup = async (id, groupData) => {
    const response = await authApiClient.put(`/groups/${id}`, groupData);
    return response.data;
  };

  const deleteGroup = async (id) => {
    const response = await authApiClient.delete(`/groups/${id}`);
    return response.data;
  };

  return {
    fetchGroups,
    fetchGroup,
    addGroup,
    updateGroup,
    deleteGroup,
  };
};

export default useGroupApi;
