const getPopulatedUser = () => {
  return {
    path: 'user',
    select: '-password',
  };
};

const getPopulatedPost = () => {
  return [
    {
      path: 'user',
      select: '-password',
    },
    {
      path: 'likes',
      select: 'name email profileImage',
    },
    {
      path: 'comments',
      populate: {
        path: 'user',
        select: '-password',
      },
    },
  ];
};

module.exports = {
  getPopulatedUser,
  getPopulatedPost,
};
