const fs = require("fs").promises;

const deltePhoto = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log(`User image Was Deleted`);
  } catch (error) {
    console.error("User image Does Not Exist");
  }
};

// export

module.exports = { deltePhoto };
