import React from 'react'
import Input from './fields/Input';
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import courseService from '../codingsena/courseService';
import { useState, useEffect } from 'react';

function SearchCourse() {
  return (
    <div className="relative w-full"> 
              <Input 
                placeholder="Search courses..." 
                withSearchIcon={true} 
                onChange={(e) => setSearch(e.target.value)} 
                value={search}
                className="w-full"
              />
              {courses && courses.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-[100] mt-1"> 
                  <div className="overflow-y-auto max-h-80 bg-white border border-gray-300 rounded-lg shadow-xl">
                    {courses.map((course) => (
                      <div 
                        key={course.id} 
                        className="p-3 text-sm text-gray-800 border-b border-gray-100 cursor-pointer transition-colors duration-150 last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        {course.batchName}
                        <MdKeyboardArrowRight className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
  )
}

export default SearchCourse