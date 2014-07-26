// ��װ����
module.exports = function(grunt) {
	// ��������
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			build: {
				src: [
					'src/common/bootstrap-common.js',
					'src/autotooltip/bootstrap-autotooltip.js',
				],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		}
	});

	// �������
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// �Զ�������
	grunt.registerTask('default', ['uglify']);
};