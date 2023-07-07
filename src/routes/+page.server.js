import { pb } from "$lib/pocketbase";

export const load = async () => {
  const records = await pb.collection("people").getFullList(100, {
    sort: "-created",
  });

  const results = records.map((record) => {
    return {
      username: record.username,
      age: record.age,
      email: record.e_mail,
      id: record.id,
    };
  });

  return {
    records: results,
  };
};

export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username") ?? "";
    const age = formData.get("age") ?? "";
    const e_mail = formData.get("email") ?? "";

    const newUser = {
      username,
      age,
      e_mail,
    };

    try {
      await pb.collection("people").create(newUser);
      return {
        addedUser: true,
        username,
      };
    } catch (error) {
      return {
        addedUser: false,
        username,
      };
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    try {
      // @ts-ignore
      await pb.collection("people").delete(id);
      return {
        userDeleted: true,
      };
    } catch (error) {
      console.log(error);
    }
  },

  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id")?.toString() || "";
    const username = formData.get("username") ?? "";
    const age = formData.get("age") ?? "";
    const e_mail = formData.get("email") ?? "";

    const newUser = {
      username,
      age,
      e_mail,
    };

    try {
      await pb.collection("people").update(id, newUser);
      return {
        updatedUser: true,
      };
    } catch (error) {
      return {
        updatedUser: false,
      };
    }
  },
};
