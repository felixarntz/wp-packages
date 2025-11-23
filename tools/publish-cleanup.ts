import * as fs from 'node:fs';
import * as path from 'node:path';

const packageJsonPath = path.join( process.cwd(), 'package.json' );

if ( ! fs.existsSync( packageJsonPath ) ) {
	console.error( 'No package.json found in the current directory.' );
	process.exit( 1 );
}

const packageJson = JSON.parse( fs.readFileSync( packageJsonPath, 'utf8' ) );
let changed = false;

const processDependencies = ( dependencies: Record< string, string > ) => {
	for ( const [ name, version ] of Object.entries( dependencies ) ) {
		if ( version.startsWith( 'file:' ) ) {
			const dependencyPath = version.slice( 5 );
			const dependencyPackageJsonPath = path.resolve( process.cwd(), dependencyPath, 'package.json' );

			if ( fs.existsSync( dependencyPackageJsonPath ) ) {
				const dependencyPackageJson = JSON.parse( fs.readFileSync( dependencyPackageJsonPath, 'utf8' ) );
				dependencies[ name ] = `^${ dependencyPackageJson.version }`;
				changed = true;
				console.log( `Updated ${ name } to ^${ dependencyPackageJson.version }` );
			} else {
				console.warn( `Could not find package.json for ${ name } at ${ dependencyPackageJsonPath }` );
			}
		}
	}
};

if ( packageJson.dependencies ) {
	processDependencies( packageJson.dependencies );
}

if ( packageJson.devDependencies ) {
	processDependencies( packageJson.devDependencies );
}

if ( changed ) {
	fs.writeFileSync( packageJsonPath, JSON.stringify( packageJson, null, '\t' ) + '\n' );
	console.log( 'Updated package.json with versioned dependencies.' );
} else {
	console.log( 'No file: dependencies found to update.' );
}
