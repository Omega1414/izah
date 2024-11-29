import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const FloatingSidebar = () => {
    const buttons = [
        { name: 'Haqqımızda', route: '/help' },
        { name: 'Yardım', route: '/about' },
        { name: 'Məxfilik', route: '/privacy' },
        { name: 'Qaydalar', route: '/terms' },
        { name: 'Əlaqə', route: '/contact' },
        { name: 'İş imkanları', route: '/careers' },
      ];
  return (
    <div className="flex mt-10">
      <div className="flex flex-wrap gap-3 text-ellipsis overflow-hidden max-w-xs text-sm">
        {buttons.map((button, index) => (
          <Link onClick={() => toast.info("Sayt təqdimat məqsədlidir")} key={index}>
            <button className="text-ellipsis text-gray-400 hover:text-gray-100">{button.name}</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FloatingSidebar;