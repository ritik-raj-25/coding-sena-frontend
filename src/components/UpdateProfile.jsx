import React, { useEffect, useState } from "react";
import userService from "../codingsena/userService";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "./fields/Button";
import defaultProfilePic from "../assets/default_profile_image.png";
import Input from "./fields/Input";
import { useForm } from "react-hook-form";
import skillService from "../codingsena/skillService";
import { toast } from "react-toastify";
import { login } from "../store/authSlice";
import { BiHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";

function UpdateProfile() {
  const user = useSelector((state) => state.authSlice.userData);
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(
    user.profilePicUrl || defaultProfilePic
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const skillsResponse = await skillService.getSkills();
        setSkills(skillsResponse.resource || []);
      } catch (err) {
        console.error("Error fetching skills:", err.message);
      }
    })();
  }, []);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      location: user.location,
      college: user.college,
      dob: user.dob,
      nickName: user.nickName,
      skills: user.skills
        ? user.skills.map((skill) => skill.id.toString())
        : [],
    },
  });

  const updateUser = async (data) => {
    try {
      if (data.skills) {
        data = {
          ...data,
          skills: data.skills.map((id) => ({ id: Number(id) })),
        };
      } else {
        data = {
          ...data,
          skills: [],
        };
      }
      for (let key in data) {
        if (data[key] === "") {
          delete data[key];
        }
      }
      const response = await userService.updateUserProfile(data);
      if (response?.success) {
        toast.success(response?.message || "Profile updated successfully.");
        userService
          .getUserProfile()
          .then((res) => {
            dispatch(login({ userData: res.resource }));
            reset();
            navigate("/dashboard/view-profile");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Failed to refresh user data. Please log in again.");
            navigate("/login");
          });
      } else {
        toast.error(
          response?.message || "Profile update failed. Please try again."
        );
      }
    } catch (err) {
      toast.error(err.message || "Profile update failed. Please try again.");
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); 
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(defaultProfilePic);
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6 border-b pb-3">
        Edit Profile Information
      </h1>
      
      <form onSubmit={handleSubmit(updateUser)} className="space-y-8">
        
        <div className="flex flex-col items-center space-y-4 pb-4">
          <div className="relative w-32 h-32">
            <img 
              src={profileImage} 
              alt="Profile Image" 
              className="w-full h-full rounded-full object-cover border-4 border-yellow-400 shadow-xl"
            />
            <Input
              type="file"
              id="profilePicInput"
              onChange={handleProfileImageChange}
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              {...register("profilePic", {
                onChange: (e) => handleProfileImageChange(e),
              })}
            />
          </div>
          <label 
            htmlFor="profilePicInput" 
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-lg font-medium cursor-pointer transition duration-150 shadow-sm text-sm"
          >
            Change Photo
          </label>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            
            <Input 
              label="Full Name" 
              type="text" 
              className="w-full"
              {...register("name")} 
            />
            
            <Input
              label="Email Address (Read-Only)"
              type="text"
              readOnly
              className="!bg-gray-100 cursor-not-allowed"
              {...register("email")}
            />
            
            <Input 
              label="Location" 
              type="text" 
              {...register("location")} 
            />
            
            <Input
              label="College/University"
              type="text"
              {...register("college")}
            />
            
            <div className="relative w-auto">
              <Input label="New Password" type={show ? "text" : "password"} {...register("password")} />
              {show ? (<BiHide onClick={() => setShow(prev => !prev)} className="absolute right-3 top-[42px] text-gray-500 w-7 h-7 cursor-pointer"/>) : (<BiSolidShow onClick={() => setShow(prev => !prev)} className="absolute right-3 top-[42px] w-7 h-7 text-gray-500 cursor-pointer"/>)}
            </div>
            
            <Input label="Date of Birth" type="date" {...register("dob")} />
            
            <Input label="Nick Name" type="text" {...register("nickName")} />
          </div>

          {skills.length > 0 && (
            <div className="pt-4">
              <label className="block text-lg font-bold text-indigo-900 mb-3">
                Select Key Skills
              </label>
              <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    className="flex items-center space-x-2 border border-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 transition duration-150 ease-in-out cursor-pointer bg-gray-50 hover:bg-indigo-50 has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600"
                  >
                    <input
                      type="checkbox"
                      value={skill.id}
                      {...register("skills")}
                      className="hidden" 
                    />
                    <span>{skill.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              onClick={() => navigate("/dashboard/view-profile")}
              className="bg-gray-300 text-white hover:bg-gray-400 cursor-pointer"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;