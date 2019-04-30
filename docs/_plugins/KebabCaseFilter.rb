module Jekyll
	module KebabCaseFilter
		def kebab_case(input)
			input.gsub!(/(.)([A-Z])/,'\1-\2').
			downcase!
		end
	end
end

Liquid::Template.register_filter(Jekyll::KebabCaseFilter)