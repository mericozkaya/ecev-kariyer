type InternProps = {
    name: string;
    department: string;
    bio: string;
    photoURL: string;
    cvURL: string;
  };
  
  export default function InternCard({
    name,
    department,
    bio,
    photoURL,
    cvURL,
  }: InternProps) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-sm border transition duration-200 hover:shadow-lg flex flex-col">
        {/* Görsel */}
        <div className="w-full h-[250px] overflow-hidden">
          <img
            src={photoURL}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>
  
        {/* Bilgiler */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#d71a28]">{name}</h2>
            <p className="text-gray-600">{department}</p>
            <p className="text-sm mt-1 break-words whitespace-normal">{bio}</p>

          </div>
  
          <a
            href={cvURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0057A0] underline text-sm mt-3 block"
          >
            CV’yi Görüntüle
          </a>
        </div>
      </div>
    );
  }
  